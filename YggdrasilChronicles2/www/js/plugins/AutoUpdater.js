/*:
 * @plugindesc [v1.0] Checks a remote manifest and auto-updates the game before the title screen shows.
 * @author YourName
 *
 * @param ManifestURL
 * @text Manifest URL
 * @desc Direct-download URL to your version.json manifest file.
 * @default https://example.com/version.json
 *
 * @param GameFolderName
 * @text Game Folder Name
 * @desc Name of the folder next to Game.exe that holds index.html/data/img/etc. Default MV uses "www" — change this if you renamed it.
 * @default www
 *
 * @help AutoUpdater.js
 * ------------------------------------------------------------------------
 * Put this plugin at the VERY TOP of the plugin list in the Plugin
 * Manager so it runs before anything else touches Scene_Boot.
 *
 * EXPECTED FOLDER LAYOUT (next to Game.exe):
 *   Game.exe
 *   version.json      <- local installed version, created automatically
 *   updater.bat        (Windows)  /  updater.sh (Mac/Linux)
 *   node_modules/adm-zip   <- required for zip extraction, see notes below
 *   www/ ...           <- your actual game files (rename via the
 *                          GameFolderName parameter if you renamed this
 *                          folder from the MV default "www")
 *
 * REMOTE version.json FORMAT (whatever URL you host it at):
 *   {
 *     "version": "1.2.0",
 *     "packageUrl": "https://github.com/you/repo/archive/refs/tags/v1.2.0.zip"
 *   }
 *
 * packageUrl can point to either:
 *   (a) GitHub's auto-generated tag archive (created just by pushing a
 *       tag from GitHub Desktop, no manual zipping needed) — the plugin
 *       auto-detects and strips the extra "reponame-tag/" wrapper folder
 *       GitHub adds, OR
 *   (b) a manually-built zip of your www/ folder (e.g. a GitHub Release
 *       asset), which has no wrapper folder.
 * Either way this plugin also stamps a version.json into the extracted
 * package automatically before applying it.
 *
 * NOTES / THINGS TO CUSTOMIZE:
 * - Excludes nothing by default. If you keep save files inside www/save,
 *   either move saves outside www/ (recommended) or add exclusion logic
 *   in the updater script so save data isn't clobbered.
 * - adm-zip must be installed as a node module reachable from Game.exe's
 *   working directory (run `npm install adm-zip` in your project root
 *   and ship the node_modules folder alongside Game.exe).
 * - Google Drive links need the uc?export=download&id=... format and
 *   will 302-redirect; fetchJSON/downloadFile below already follow
 *   redirects once. Large files may need the confirm-token workaround.
 * ------------------------------------------------------------------------
 */

(() => {
  'use strict';

  const pluginName = 'AutoUpdater';
  const parameters = PluginManager.parameters(pluginName);
  const MANIFEST_URL = parameters['ManifestURL'];
  const GAME_FOLDER_NAME = parameters['GameFolderName'] || 'www';

  const path = require('path');
  const fs = require('fs');
  const https = require('https');
  const { spawn } = require('child_process');

  // Root of the game install (the folder Game.exe lives in, one level above www/)
  const GAME_ROOT = path.join(process.mainModule.path, '..');
  const LOCAL_VERSION_FILE = path.join(GAME_ROOT, 'version.json');
  const TEMP_DIR = path.join(GAME_ROOT, 'update_temp');

  function readLocalVersion() {
    try {
      const raw = fs.readFileSync(LOCAL_VERSION_FILE, 'utf8');
      return JSON.parse(raw).version;
    } catch (e) {
      return '0.0.0'; // no local version file yet -> treat as needing update
    }
  }

  function fetchJSON(url) {
    return new Promise((resolve, reject) => {
      https.get(url, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          fetchJSON(res.headers.location).then(resolve, reject);
          return;
        }
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(e);
          }
        });
      }).on('error', reject);
    });
  }

  function downloadFile(url, destPath) {
    return new Promise((resolve, reject) => {
      const file = fs.createWriteStream(destPath);
      https.get(url, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          file.close();
          fs.unlink(destPath, () => {});
          downloadFile(res.headers.location, destPath).then(resolve, reject);
          return;
        }
        res.pipe(file);
        file.on('finish', () => file.close(resolve));
      }).on('error', reject);
    });
  }

  function compareVersions(a, b) {
    const pa = a.split('.').map(Number);
    const pb = b.split('.').map(Number);
    for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
      const na = pa[i] || 0, nb = pb[i] || 0;
      if (na > nb) return 1;
      if (na < nb) return -1;
    }
    return 0;
  }

  function extractZip(zipPath, destDir) {
    const AdmZip = require('adm-zip'); // must be available as a node module
    const zip = new AdmZip(zipPath);
    zip.extractAllTo(destDir, true);
  }

  // GitHub's auto-generated tag archives (e.g. archive/refs/tags/v1.1.0.zip)
  // wrap everything in one extra top-level folder named like
  // "reponame-1.1.0/". A manually-zipped build (where you zipped your
  // game folder directly) does NOT have this wrapper — its single
  // top-level entry is already your game folder (GAME_FOLDER_NAME). So:
  // if extraction produced exactly one top-level folder and it's NOT
  // named GAME_FOLDER_NAME, treat it as GitHub's wrapper and move its
  // contents up one level.
  function flattenGithubArchiveWrapper(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    if (entries.length === 1 && entries[0].isDirectory() && entries[0].name !== GAME_FOLDER_NAME) {
      const wrapper = path.join(dir, entries[0].name);
      for (const item of fs.readdirSync(wrapper)) {
        fs.renameSync(path.join(wrapper, item), path.join(dir, item));
      }
      fs.rmdirSync(wrapper);
    }
  }

  function launchUpdaterAndQuit(updatePackageDir) {
    const isWin = process.platform === 'win32';
    const script = isWin ? path.join(GAME_ROOT, 'updater.bat')
                          : path.join(GAME_ROOT, 'updater.sh');
    const exeName = isWin ? 'Game.exe' : 'Game';

    const child = spawn(
      isWin ? 'cmd.exe' : 'sh',
      isWin ? ['/c', script, updatePackageDir, GAME_ROOT, exeName]
            : [script, updatePackageDir, GAME_ROOT, exeName],
      { detached: true, stdio: 'ignore' }
    );
    child.unref();

    nw.App.quit();
  }

  //--------------------------------------------------------------------
  // Hook into Scene_Boot so the update check happens before the title
  //--------------------------------------------------------------------

  const _Scene_Boot_start = Scene_Boot.prototype.start;
  Scene_Boot.prototype.start = function () {
    this._updateChecked = false;
    this._updateStatusText = 'Checking for updates...';
    this.drawUpdateStatus();
    this.checkForUpdate();
    // Original Scene_Boot.start() is deliberately deferred until
    // resumeNormalBoot() runs, once the update check resolves.
  };

  Scene_Boot.prototype.drawUpdateStatus = function () {
    if (!this._updateStatusSprite) {
      this._updateStatusSprite = new Sprite(new Bitmap(Graphics.width, 64));
      this._updateStatusSprite.y = Graphics.height - 96;
      this.addChild(this._updateStatusSprite);
    }
    const bmp = this._updateStatusSprite.bitmap;
    bmp.clear();
    bmp.fontSize = 20;
    bmp.drawText(this._updateStatusText, 0, 0, Graphics.width, 32, 'center');
  };

  Scene_Boot.prototype.checkForUpdate = async function () {
    try {
      const remote = await fetchJSON(MANIFEST_URL);
      const localVersion = readLocalVersion();

      if (compareVersions(remote.version, localVersion) <= 0) {
        this.resumeNormalBoot();
        return;
      }

      this._updateStatusText = `Downloading update ${remote.version}...`;
      this.drawUpdateStatus();

      if (fs.existsSync(TEMP_DIR)) fs.rmSync(TEMP_DIR, { recursive: true, force: true });
      fs.mkdirSync(TEMP_DIR, { recursive: true });

      const zipPath = path.join(TEMP_DIR, 'update.zip');
      await downloadFile(remote.packageUrl, zipPath);

      this._updateStatusText = 'Applying update...';
      this.drawUpdateStatus();

      const extractDir = path.join(TEMP_DIR, 'extracted');
      fs.mkdirSync(extractDir, { recursive: true });
      extractZip(zipPath, extractDir);
      flattenGithubArchiveWrapper(extractDir);

      // Stamp the new version so the updater script can drop it in place.
      fs.writeFileSync(
        path.join(extractDir, 'version.json'),
        JSON.stringify({ version: remote.version })
      );

      this._updateStatusText = 'Restarting to apply update...';
      this.drawUpdateStatus();

      setTimeout(() => launchUpdaterAndQuit(extractDir), 500);
    } catch (err) {
      console.error('[AutoUpdater] Update check failed:', err);
      // Fail open: never block the player from playing because of a
      // network hiccup or bad manifest.
      this.resumeNormalBoot();
    }
  };

  Scene_Boot.prototype.resumeNormalBoot = function () {
    if (this._updateChecked) return;
    this._updateChecked = true;
    _Scene_Boot_start.call(this);
  };
})();
function wait(ms) {
  return new Promise((r) => {
    setTimeout(r, ms);
  });
}

function getFirstServiceWorker(browser) {
  const targets = browser.targets().filter((target) => {
    return target.type() === 'service_worker';
  });
  if (targets.length < 1) {
    throw new Error('No service worker found');
  }
  return targets[0];
}

function getFirstPage(browser) {
  const targets = browser.targets().filter((target) => {
    return target.type() === 'page';
  });
  if (targets.length < 1) {
    throw new Error('No pages found');
  }
  return targets[0];
}

class ServiceWorkerHandle {
  async setup(page) {
    this.pageSession = await page.createCDPSession();
    await this.pageSession.send('ServiceWorker.enable');
    this.pageSession.on('ServiceWorker.workerVersionUpdated', this.onVersionUpdated.bind(this));
    return this;
  }
  onVersionUpdated({ versions }) {
    if (versions && versions.length > 0) {
      const info = versions.pop();
      this.lastVersion = String(info.versionId);
    }
  }
  inspect() {
    return this.pageSession.send('ServiceWorker.inspectWorker', {
      versionId: this.lastVersion
    });
  }
}

function getServiceWorkerHandle(browser) {
  const handle = new ServiceWorkerHandle();
  return handle.setup.call(handle, getFirstPage(browser));
}

module.exports = {
  wait,
  getFirstServiceWorker,
  getFirstPage,
  getServiceWorkerHandle
};
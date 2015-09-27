export function defaultJspmApp(config) {
	if (!config) throw new Error('must provide a config object as the first parameter');
	if (typeof config.configJsURI !== 'string') throw new Error('must provide a configJsURI string');
	if (typeof config.systemJsURI !== 'string') throw new Error('must provide a systemJsURI string');

	let app = {};
	app.entryWillBeInstalled = function() { return entryWillBeInstalled.apply(config, arguments); }
	app.entryWasInstalled = function() { return entryWasInstalled.apply(config, arguments); }
	app.applicationWillMount = function() { return applicationWillMount.apply(config, arguments); }
	app.mountApplication = function() { return mountApplication.apply(config, arguments); }
	app.applicationWasMounted = function() { return applicationWasMounted.apply(config, arguments); }
	app.applicationWillUnmount = function() { return applicationWillUnmount.apply(config, arguments); }
	app.unmountApplication = function() { return unmountApplication.apply(config, arguments); }
	app.activeApplicationSourceWillUpdate = function() { return activeApplicationSourceWillUpdate.apply(config, arguments); }
	app.activeApplicationSourceWasUpdated = function() { return activeApplicationSourceWasUpdated.apply(config, arguments); }
	return app;
}

export function entryWillBeInstalled() {
	return new Promise(function (resolve, reject) {
		switchToAppLoader.call(this)
		.then(() => window.System.import(this.configJsURI))
		.then(() => resolve());
	}.bind(this));
}

export function entryWasInstalled() {
	return new Promise(function (resolve) {
		switchToNativeLoader.call(this)
		.then(() => resolve());
	}.bind(this))
}

export function applicationWillMount() {
	return new Promise(function (resolve) {
		switchToAppLoader.call(this)
		.then(() => resolve());
	}.bind(this));
}

export function mountApplication() {
	return new Promise(function (resolve) {
		resolve()
	}.bind(this));
}

export function applicationWasMounted() {
	return new Promise(function(resolve) {
		resolve()
	}.bind(this));
}

export function applicationWillUnmount() {
	return new Promise(function(resolve) {
		resolve()
	}.bind(this));
}

export function unmountApplication() {
	return new Promise(function (resolve) {
		switchToNativeLoader.call(this)
		.then(() => resolve());
	}.bind(this));
}

export function activeApplicationSourceWillUpdate() {
	return new Promise(function(resolve) {
		resolve()
	}.bind(this));
}

export function activeApplicationSourceWasUpdated() {
	return new Promise(function(resolve) {
		resolve()
	}.bind(this));
}

var cachebuster = 0;

function switchToAppLoader() {
	return new Promise((resolve) => {
		if (!this.appLoader) {
			this.nativeSystemGlobal = window.System;
			delete window.System;
			let scriptEl = document.createElement('script');
			scriptEl.src = `${this.systemJsURI}?cachebuster=${cachebuster++}`;
			scriptEl.async = true;
			scriptEl.onreadystatechange = scriptEl.onload = function() {
				this.appLoader = window.System;
				resolve();
			}.bind(this)
			document.head.appendChild(scriptEl);
		} else {
			this.nativeSystemGlobal = window.System;
			window.System = this.appLoader;
			resolve();
		}
	})
}

function switchToNativeLoader() {
	return new Promise((resolve) => {
		window.System = this.nativeSystemGlobal;
		resolve();
	})
}

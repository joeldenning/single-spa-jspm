export function defaultJspmApp(config = {}) {
	let app = {};
	app.scriptsWillBeLoaded = function() { return scriptsWillBeLoaded.apply(config, arguments); }
	app.scriptsWereLoaded = function() { return scriptsWereLoaded.apply(config, arguments); }
	app.applicationWillMount = function() { return applicationWillMount.apply(config, arguments); }
	app.mountApplication = function() { return mountApplication.apply(config, arguments); }
	app.applicationWasMounted = function() { return applicationWasMounted.apply(config, arguments); }
	app.applicationWillUnmount = function() { return applicationWillUnmount.apply(config, arguments); }
	app.applicationWasUnmounted = function() { return applicationWillUnmount.apply(config, arguments); }
	app.activeApplicationSourceWillUpdate = function() { return activeApplicationSourceWillUpdate.apply(config, arguments); }
	app.activeApplicationSourceWasUpdated = function() { return activeApplicationSourceWasUpdated.apply(config, arguments); }
	return app;
}

export function scriptsWillBeLoaded() {
	return new Promise(function (resolve, reject) {
		this.nativeSystemGlobal = window.System;
		delete window.System;
		resolve()
	}.bind(this));
}

export function scriptsWereLoaded() {
	return new Promise(function (resolve) {
		this.appLoader = window.System;
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

export function applicationWasUnmounted() {
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
			throw new Error(`cannot switch to this app's jspm loader -- no app loader exists`)
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

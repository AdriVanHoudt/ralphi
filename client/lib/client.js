/**
 * @file
 * @description Ralphi Client for querying Ralphi server
 */
'use strict';
const promHttpRequest = require('./promHttpRequest');
const defaults = {
	host: 'localhost',
	port: 8910
};

class RalphiClient {
	constructor (config = {}) {
		if (config.host !== undefined && (!config.host || typeof config.host !== 'string')) {
			throw new Error('Config host must be a string with value');
		}
		if (config.port !== undefined && (config.port < 1 || parseInt(config.port, 10) !== config.port)) {
			throw new Error('Config port must be positive numeric integer');
		}
		this.settings = Object.assign({}, defaults, config);
	}

	/**
	 * Removes 1 token
	 * @param  {String} bucket
	 * @param  {String} key
	 * @return {Promise<Object>}
	 */
	take (bucket, key) {
		if (!bucket || typeof bucket !== 'string') {
			throw new Error('Bucket must exist and be a string');
		}
		if (!key || typeof key !== 'string') {
			throw new Error('Key must exist and be a string');
		}
		return promHttpRequest({
				method: 'GET',
				host: this.settings.host,
				port: this.settings.port,
				path: `/${bucket}/${key}`
			}).then(data => {
				data = JSON.parse(data);
				data.ttl = Math.ceil(data.ttl / 1000);
				return data;
			});
	}

	/**
	 * Reset key record in bucket
	 * @param  {String} bucket
	 * @param  {String} key
	 * @return {Promise<Boolean>}
	 */
	reset (bucket, key) {
		if (!bucket || typeof bucket !== 'string') {
			throw new Error('Bucket must exist and be a string');
		}
		if (!key || typeof key !== 'string') {
			throw new Error('Key must exist and be a string');
		}
		return promHttpRequest({
				method: 'DELETE',
				host: this.settings.host,
				port: this.settings.port,
				path: `/${bucket}/${key}`
			}).then(data => {
				return data === 'true';
			});
	}

	/**
	 * Clean all expired records
	 * @return {Promise<Boolean>}
	 */
	clean () {
		return promHttpRequest({
				method: 'DELETE',
				host: this.settings.host,
				port: this.settings.port,
				path: '/clean'
			}).then(data => {
				return data === 'true';
			});
	}
}

module.exports = RalphiClient;
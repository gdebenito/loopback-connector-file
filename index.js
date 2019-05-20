'use strict';

const assert = require('assert');
const path = require('path');
const fs = require('fs');


/**
 * Initialize the connector
 */
exports.initialize = function initialize(dataSource, callback) {
	const connector = dataSource.connector = new FileConnector(dataSource.settings, dataSource);
	connector.getDataAccessObject();
	dataSource.connector.dataSource = dataSource;

	if (callback) {
		process.nextTick(callback);
	}
};



function FileConnector(settings) {
	assert(typeof settings ===
		'object',
		'cannot initialize FileConnector without a settings object');

	// Set the root path
	this.root = settings.root;

	// Set the settings path
	this.file = settings.file;
};


/**
 * Get DAO
 */
FileConnector.prototype.getDataAccessObject = function () {
	if (this.DataAccessObject) {
		return this.DataAccessObject;
	}
	var self = this;
	var DataAccessObject = {};
	self.DataAccessObject = DataAccessObject;

	self.DataAccessObject.get = function () {
		const filePath = path.join(self.root, self.file);
		const file = fs.readFileSync(filePath, { encoding: 'utf8', flag: 'r' })
		return file;
	}

	self.DataAccessObject.overwrite = function (text) {
		const filePath = path.join(self.root, self.file);
		fs.writeFileSync(filePath, text)
	}

	self.DataAccessObject.append = function (text) {
		const filePath = path.join(self.root, self.file);
		fs.appendFileSync(filePath, text, { encoding: 'utf8', flag: 'w' })
	}

	return self.DataAccessObject;
}
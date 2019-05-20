'use strict';

const assert = require('assert');
const path = require('path');
const fs = require('fs');


/**
 * Initialize the connector
 */
exports.initialize = function initialize(dataSource, callback) {

	// Initialize the FileConnector with the Datasource settings ( datasource.json )
	// dataSource.settings is the object representation of datasource.json that is
	// injected in the constructor of the Datasource ( super(dsConfig) ) 
	const connector = dataSource.connector = new FileConnector(dataSource.settings);

	// Initialize the DataAccessObject
	connector.getDataAccessObject();
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
};

/**
 *  This controller don't have the connect method.
 *  Is not required for localhost filesystem
 */
FileConnector.prototype.connect = function () {
}


/**
 * Get DAO
 */
FileConnector.prototype.getDataAccessObject = function () {
	if (this.DataAccessObject) {
		return this.DataAccessObject;
	}
	var self = this;
	var DataAccessObject = {
		getFolder: async function () {
			// Get the stats of the directory, to know if exists
			const stats = await fs.stat(self.root);
			// If is a file then
			if (stats.isDirectory()) {
				// Return the files inside the directory
				const fileNames = await fs.readdir(self.root);
				return fileNames;
			}

		},
		get: async function (file) {
			// Get the File Path we want to access
			const filePath = path.join(self.root, file);
			// Get the stats of the file, to know if exists
			const stats = await fs.stat(path);
			// If is a file then
			if (stats.isFile()) {
				// Return the data inside the file
				return await fs.readFile(filePath, 'utf8');;
			}

		},
		overwrite: async function (file, text) {
			const filePath = path.join(self.root, file);
			const stats = await fs.stat(path);
			if (stats.isFile()) {
				await fs.writeFile(filePath, text, 'utf8');
			}
		},

		append: async function (file, text) {
			const filePath = path.join(self.root, file);
			const stats = await fs.stat(path);
			if (stats.isFile()) {
				await fs.appendFile(filePath, text, 'utf8');
			}
		},

		delete: async function (file) {
			const filePath = path.join(self.root, file);
			const stats = await fs.stat(path);
			if (stats.isFile()) {
				await fs.unlink(filePath, text, 'utf8');
			}
		},

	};
	self.DataAccessObject = DataAccessObject;
	return self.DataAccessObject;
}
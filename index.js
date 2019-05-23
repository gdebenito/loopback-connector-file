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

	dataSource.connector.dataSource = dataSource;

	if (callback) {
		process.nextTick(callback);
	}

};

function FileConnector(settings) {
	assert(typeof settings ===
		'object',
		'cannot initialize FileConnector without a settings object');

	const stats = fs.statSync(settings.root);

	// If is a directory
	if (stats.isDirectory()) {
		// Set the root path
		this.root = settings.root;
	} else {
		throw Error('Bad directory');
	}
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
	const self = this;
	const DataAccessObject = {};

	self.DataAccessObject = DataAccessObject;

	self.DataAccessObject.getFolder = function () {
		// Return the files inside the directory
		const fileNames = fs.readdirSync(self.root);
		return fileNames;
	}


	self.DataAccessObject.get = function (file) {
		let file;

		// Get the File Path we want to access
		const filePath = path.join(self.root, file);

		// Get the stats of the file, to know if exists
		const stats = fs.statSync(filePath);

		// If is a file then
		if (stats.isFile()) {

			// Return the data from the file
			file = fs.readFileSync(filePath, 'utf8');
		}
		return file;
	}
	self.DataAccessObject.overwrite = function (file, text) {
		fs.writeFileSync(path.join(self.root, file), text, 'utf8');
	}

	self.DataAccessObject.append = function (file, text) {

		const filePath = path.join(self.root, file);
		const stats = fs.statSync(filePath);

		if (stats.isFile()) {
			fs.appendFileSync(filePath, text, 'utf8');
		} else {
			// Then new file
			fs.writeFileSync(filePath, text, 'utf8');
		}
	}

	self.DataAccessObject.delete = function (file) {
		const filePath = path.join(self.root, file);
		const stats = fs.statSync(filePath);
		if (stats.isFile()) {
			fs.unlinkSync(filePath, text, 'utf8');
		}
	}

	return self.DataAccessObject;
}
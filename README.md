# Loopback Connector File
Usage:

file.datasource.json
```json
{
  "name": "filedatasource", // The name you want
  "connector": "loopback-connector-file", // The loopback connector reposituory
  "root": "./storage" // The directory you want to access
}
```

file.service.ts
```ts
export interface FileService {
	getFolder(): Array<string>;
	get(file: string): string;
	overwrite(file: string, data: string): void;
	append(file: string, data: string): void;
	delete(file: string): void;
}
```

file.provider.ts
```ts
import { getService, juggler } from '@loopback/service-proxy';
import { inject, Provider } from '@loopback/core';
import { FileDataSource } from '../datasources/file.datasource';
import { FileService } from '../services/file.service';

export class FileProvider implements Provider<FileService> {
	constructor(
		@inject('datasources.file')
		protected dataSource: juggler.DataSource = new FileDataSource(),
	) { }

	value(): Promise<FileService> {
		return getService(this.dataSource);
	}
}
```

File Controller example
```ts

import { inject } from '@loopback/context';
import { get, requestBody, post, put, RequestBodyObject, param } from "@loopback/rest";

const TEXT_PLAIN_REQUEST: RequestBodyObject = {
	description: '',
	required: true,
	content: {
		'text/plain': {
			schema: {
				type: 'string'

			}
		}
	}

}

export class FileController {
	constructor(
		@inject('file.provider') private fileService: FileService
	) { }

	@get('/files')
	async getFolder() {
		return this.fileService.getFolder();
	}

	@get('/files/{filename}')
	async getFile(
		@param.path.string('filename') filename: string
	) {
		return this.fileService.get(filename);
	}

	@put('/files/{filename}')
	async putFile(
		@param.path.string('filename') filename: string,
		@requestBody(TEXT_PLAIN_REQUEST) body: string
	) {
		return this.fileService.overwrite(filename, body);
	}

	@post('/files/{filename}')
	async postFile(
		@param.path.string('filename') filename: string,
		@requestBody(TEXT_PLAIN_REQUEST) body: string
	) {
		return this.fileService.append(filename, body);
	}
}
```


Do not use on production, this is test.
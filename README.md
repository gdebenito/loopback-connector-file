# Loopback Connector File
Usage:

file.datasource.json
```json
{
  "name": "filedatasource", // The name you want
  "connector": "loopback-connector-file", // The loopback connector reposituory
  "root": "./storage", // The directory you want to access
  "file": "myfile.txt" // The file you want to serve
}
```

file.service.ts
```ts
export interface FileService {
	getFile(): string;
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
import { FileService } from "../services/file.service";

// Uncomment these imports to begin using these cool features!

import { inject } from '@loopback/context';
import { get } from "@loopback/rest";

export class FileController {
	constructor(
		@inject('file.provider') private fileService: FileService
	) { }

	@get('/file')
	async getFile() {
		// console.log(this.fileService)
		return this.fileService.getFile();
	}

}
```


Do not use on production, this is test.
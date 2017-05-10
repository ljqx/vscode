/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict';

import { Action } from 'vs/base/common/actions';
import { TPromise } from 'vs/base/common/winjs.base';
import { IWindowService } from 'vs/platform/windows/common/windows';
import { IMessageService } from 'vs/platform/message/common/message';

// tslint:disable
import pkg from 'vs/platform/node/package';
// tslint:enable

// Enable this by default
function getDefaultValue(): boolean {
	const minorVersion = pkg.version.replace(/^(\d+\.\d+).*$/, '$1');
	const forcedVersion = window.localStorage.getItem('forcedPreviewSCMVersion');

	if (forcedVersion !== minorVersion) {
		window.localStorage.setItem('forcedPreviewSCMVersion', minorVersion);
		window.localStorage.setItem('enablePreviewSCM', 'true');
	}

	const value = window.localStorage.getItem('enablePreviewSCM');
	return value !== 'false';
}

export default class SCMPreview {

	private static readonly _enabled = getDefaultValue();

	static get enabled(): boolean {
		return this._enabled;
	}

	static set enabled(enabled: boolean) {
		window.localStorage.setItem('enablePreviewSCM', enabled ? 'true' : 'false');
	}
}

export class EnableSCMPreviewAction extends Action {

	static ID = 'enablescmpreview';
	static LABEL = 'Disable Legacy Git';

	constructor(
		id = EnableSCMPreviewAction.ID,
		label = EnableSCMPreviewAction.LABEL,
		@IWindowService private windowService: IWindowService,
		@IMessageService private messageService: IMessageService,
	) {
		super(EnableSCMPreviewAction.ID, EnableSCMPreviewAction.LABEL, '', true);
	}

	run(): TPromise<void> {
		const message = 'This will reload this window, do you want to continue?';
		const result = this.messageService.confirm({ message });

		if (!result) {
			return undefined;
		}

		SCMPreview.enabled = true;
		return this.windowService.reloadWindow();
	}
}

export class DisableSCMPreviewAction extends Action {

	static ID = 'disablescmpreview';
	static LABEL = 'Enable Legacy Git';

	constructor(
		id = DisableSCMPreviewAction.ID,
		label = DisableSCMPreviewAction.LABEL,
		@IWindowService private windowService: IWindowService,
		@IMessageService private messageService: IMessageService,
	) {
		super(DisableSCMPreviewAction.ID, DisableSCMPreviewAction.LABEL, '', true);
	}

	run(): TPromise<void> {
		const message = 'This will reload this window, do you want to continue?';
		const result = this.messageService.confirm({ message });

		if (!result) {
			return undefined;
		}

		SCMPreview.enabled = false;
		return this.windowService.reloadWindow();
	}
}
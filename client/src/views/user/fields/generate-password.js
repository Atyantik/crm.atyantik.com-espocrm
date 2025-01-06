/************************************************************************
 * This file is part of EspoCRM.
 *
 * EspoCRM – Open Source CRM application.
 * Copyright (C) 2014-2024 Yurii Kuznietsov, Taras Machyshyn, Oleksii Avramenko
 * Website: https://www.espocrm.com
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 *
 * The interactive user interfaces in modified source and object code versions
 * of this program must display Appropriate Legal Notices, as required under
 * Section 5 of the GNU Affero General Public License version 3.
 *
 * In accordance with Section 7(b) of the GNU Affero General Public License version 3,
 * these Appropriate Legal Notices must retain the display of the "EspoCRM" word.
 ************************************************************************/

import BaseFieldView from 'views/fields/base';

class UserGeneratePasswordFieldView extends BaseFieldView {

    templateContent = `
        <button
            type="button"
            class="btn btn-default"
            data-action="generatePassword"
        >{{translate 'Generate' scope='User'}}</button>`

    events = {
        /** @this {UserGeneratePasswordFieldView} */
        'click [data-action="generatePassword"]': function () {
            this.actionGeneratePassword();
        },
    }

    setup() {
        super.setup();

        this.listenTo(this.model, 'change:password', (model, value, o) => {
            if (o.isGenerated) {
                return;
            }

            if (value !== undefined) {
                this.model.set('passwordPreview', null);

                return;
            }

            this.model.unset('passwordPreview');
        });

        this.strengthParams = this.options.strengthParams || {};

        this.passwordStrengthLength = this.strengthParams.passwordStrengthLength ||
            this.getConfig().get('passwordStrengthLength');

        this.passwordStrengthLetterCount = this.strengthParams.passwordStrengthLetterCount ||
            this.getConfig().get('passwordStrengthLetterCount');

        this.passwordStrengthNumberCount = this.strengthParams.passwordStrengthNumberCount ||
            this.getConfig().get('passwordStrengthNumberCount');

        this.passwordGenerateLength = this.strengthParams.passwordGenerateLength ||
            this.getConfig().get('passwordGenerateLength');

        this.passwordGenerateLetterCount = this.strengthParams.passwordGenerateLetterCount ||
            this.getConfig().get('passwordGenerateLetterCount');

        this.passwordGenerateNumberCount = this.strengthParams.passwordGenerateNumberCount ||
            this.getConfig().get('passwordGenerateNumberCount');
    }

    fetch() {
        return {};
    }

    actionGeneratePassword() {
        let length = this.passwordStrengthLength;
        let letterCount = this.passwordStrengthLetterCount;
        let numberCount = this.passwordStrengthNumberCount;

        const generateLength = this.passwordGenerateLength || 10;
        const generateLetterCount = this.passwordGenerateLetterCount || 4;
        const generateNumberCount = this.passwordGenerateNumberCount || 2;

        length = (typeof length === 'undefined') ? generateLength : length;
        letterCount = (typeof letterCount === 'undefined') ? generateLetterCount : letterCount;
        numberCount = (typeof numberCount === 'undefined') ? generateNumberCount : numberCount;

        if (length < generateLength) {
            length = generateLength;
        }

        if (letterCount < generateLetterCount) {
            letterCount = generateLetterCount;
        }

        if (numberCount < generateNumberCount) {
            numberCount = generateNumberCount;
        }

        const password = this.generatePassword(length, letterCount, numberCount, true);

        this.model.set({
            password: password,
            passwordConfirm: password,
            passwordPreview: password,
        }, {isGenerated: true});
    }

    generatePassword(length, letters, numbers, bothCases) {
        const chars = [
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
            '0123456789',
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
            'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            'abcdefghijklmnopqrstuvwxyz',
        ];

        let upperCase = 0;
        let lowerCase = 0;

        if (bothCases) {
            upperCase = 1;
            lowerCase = 1;

            if (letters >= 2) {
                letters = letters - 2;
            } else {
                letters = 0;
            }
        }

        let either = length - (letters + numbers + upperCase + lowerCase);

        if (either < 0) {
            either = 0;
        }

        const setList = [letters, numbers, either, upperCase, lowerCase];

        const shuffle = function (array) {
            let currentIndex = array.length, temporaryValue, randomIndex;

            while (0 !== currentIndex) {
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex -= 1;
                temporaryValue = array[currentIndex];
                array[currentIndex] = array[randomIndex];
                array[randomIndex] = temporaryValue;
            }

            return array;
        };

        const array = setList.map(
            (len, i) => Array(len).fill(chars[i]).map(
                x => x[Math.floor(Math.random() * x.length)]
            ).join('')
        ).concat();

        return shuffle(array).join('');
    }
}

export default UserGeneratePasswordFieldView;

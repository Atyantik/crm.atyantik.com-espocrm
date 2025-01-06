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

import RecordController from 'controllers/record';

class PortalUserController extends RecordController {

    entityType = 'User'

    getCollection(usePreviouslyFetched) {
        return super.getCollection()
            .then(collection => {
                collection.data.userType = 'portal';

                return collection;
            });
    }

    /**
     * @protected
     * @param {Object} options
     * @param {module:models/user} model
     * @param {string} view
     */
    createViewView(options, model, view) {
        if (!model.isPortal()) {
            if (model.isApi()) {
                this.getRouter().dispatch('ApiUser', 'view', {id: model.id, model: model});

                return;
            }

            this.getRouter().dispatch('User', 'view', {id: model.id, model: model});

            return;
        }

        super.createViewView(options, model, view);
    }

    actionCreate(options) {
        options = options || {};
        options.attributes = options.attributes  || {};
        options.attributes.type = 'portal';

        super.actionCreate(options);
    }

    checkAccess(action) {
        if (this.getAcl().getPermissionLevel('portalPermission') === 'yes') {
            return true;
        }

        return false;
    }
}

export default PortalUserController;

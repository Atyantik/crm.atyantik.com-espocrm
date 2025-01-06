<?php
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

$config = $installer->getConfig();
$metadata = $installer->getMetadata();

$fields = [
    'dateFormat' => [
        'default' => $config->get('dateFormat'),
        'options' => $metadata->get(['app', 'dateTime', 'dateFormatList']) ?? [],
    ],
    'timeFormat' => [
        'default'=> $config->get('timeFormat'),
        'options' => $metadata->get(['app', 'dateTime', 'timeFormatList']) ?? [],
    ],
    'timeZone' => [
        'default'=> $config->get('timeZone', 'UTC'),
    ],
    'weekStart' => [
        'default'=> $config->get('weekStart', 0),
    ],
    'defaultCurrency' => [
        'default' => $config->get('defaultCurrency', 'USD'),
    ],
    'thousandSeparator' => [
        'default' => $config->get('thousandSeparator', ','),
    ],
    'decimalMark' => [
        'default' => $config->get('decimalMark', '.'),
    ],
    'language' => [
        'default' => (!empty($_SESSION['install']['user-lang'])) ?
            $_SESSION['install']['user-lang'] :
            $config->get('language', 'en_US'),
    ],
];

foreach ($fields as $fieldName => $field) {
    if (isset($_SESSION['install'][$fieldName])) {
        $fields[$fieldName]['value'] = $_SESSION['install'][$fieldName];
    } else {
        $fields[$fieldName]['value'] = isset($field['default']) ? $field['default'] : '';
    }
}

$smarty->assign('fields', $fields);

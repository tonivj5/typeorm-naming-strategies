// Credits to @recurrence
// https://gist.github.com/recurrence/b6a4cb04a8ddf42eda4e4be520921bd2

import {DefaultNamingStrategy, NamingStrategyInterface, Table} from 'typeorm';
import {snakeCase} from 'typeorm/util/StringUtils';
import {RandomGenerator} from 'typeorm/util/RandomGenerator';

console.log(' ======== Custom Naming Strategy has been loaded ======== ');

// TODO(pmestemaker): handle 64 character limit on object names
// TODO(pmestemaker): Change console.log to some optional logging system

export class SnakeNamingStrategy extends DefaultNamingStrategy
  implements NamingStrategyInterface {
  foreignKeyName(tableOrName: Table | string, columnNames: string[], _referencedTablePath?: string, _referencedColumnNames?: string[]): string {
    const tableName = tableOrName instanceof Table ? tableOrName.name : tableOrName;
    const replacedTableName = tableName.replace('.', '_');
    const replacedReferencedTableName = _referencedTablePath?.replace('.', '_');
    const key = `${replacedTableName}__${replacedReferencedTableName}__${columnNames.join('_')}__${_referencedColumnNames?.join('_')}`;
    const retVal = `fk_${key}`;

    console.log(`foreignKeyName, tableOrName: ${tableOrName}\tcolumnNames: ${columnNames}\t_referencedTablePath: "${_referencedTablePath}"\t_referencedColumnNames: ${_referencedColumnNames}\tretVal: ${retVal}`);
    return retVal;
  }

  primaryKeyName(tableOrName: Table | string, columnNames: string[]): string {
    console.log('This does not appear to be called.');
    const tableName = tableOrName instanceof Table ? tableOrName.name : tableOrName;
    const replacedTableName = tableName.replace('.', '_');
    const key = `${replacedTableName}__${columnNames.join('_')}`;
    const retVal = `pk_${key}`;
    console.log(`primaryKeyName, tableOrName: ${tableOrName}\tcolumnNames: ${columnNames}\tretVal: ${retVal}`);
    return retVal;
  }

  indexName(tableOrName: Table | string, columnNames: string[], where?: string): string {
    // We are deviating from the reference implementation by not sorting columns alphabetically.
    // ['id', 'name'] is a legitimately different index than ['name', 'id'].. so we should generate two separate indexes for those!
    const tableName = tableOrName instanceof Table ? tableOrName.name : tableOrName;
    const replacedTableName = tableName.replace('.', '_');
    const key_without_where = `${replacedTableName}__${columnNames.join('_')}`;
    let hash = '';
    if (where) {
      const fullKey = `${key_without_where}__${where}`;
      // only add a hash to the end if there is a special where clause on the index
      hash = `__${RandomGenerator.sha1(fullKey).substr(0, 4)}`;
    }
    const retVal = `idx_${key_without_where}${hash}`;

    console.log(`indexName, tableOrName: ${tableOrName}\tcolumnNames: ${columnNames}\twhere: "${where}"\tretVal: ${retVal}`);
    return retVal;
  }

  uniqueConstraintName(tableOrName: Table | string, columnNames: string[]): string {
    // const retVal = super.uniqueConstraintName(tableOrName, columnNames);

    // // sort incoming column names to avoid issue when ["id", "name"] and ["name", "id"] arrays
    // const clonedColumnNames = [...columnNames];
    // clonedColumnNames.sort();
    const tableName = tableOrName instanceof Table ? tableOrName.name : tableOrName;
    const replacedTableName = tableName.replace('.', '_');
    const key = `${replacedTableName}__${columnNames.join('_')}`;
    const retVal = 'uc_' + key;

    console.log(`uniqueConstraintName, tableOrName: ${tableOrName}\tcolumnNames: ${columnNames}\tretVal: ${retVal}`);

    return retVal;
  }

  tableName(className: string, customName: string): string {
    return customName ? customName : snakeCase(className);
  }

  columnName(
    propertyName: string,
    customName: string,
    embeddedPrefixes: string[],
  ): string {
    return (
      snakeCase(embeddedPrefixes.join('_')) +
      (customName ? customName : snakeCase(propertyName))
    );
  }

  relationName(propertyName: string): string {
    return snakeCase(propertyName);
  }

  joinColumnName(relationName: string, referencedColumnName: string): string {
    return snakeCase(relationName + '_' + referencedColumnName);
  }

  joinTableName(
    firstTableName: string,
    secondTableName: string,
    firstPropertyName: string,
    secondPropertyName: string,
  ): string {
    return snakeCase(
      firstTableName +
        '_' +
        firstPropertyName.replace(/\./gi, '_') +
        '_' +
        secondTableName,
    );
  }

  joinTableColumnName(
    tableName: string,
    propertyName: string,
    columnName?: string,
  ): string {
    return snakeCase(
      tableName + '_' + (columnName ? columnName : propertyName),
    );
  }

  classTableInheritanceParentColumnName(
    parentTableName: any,
    parentTableIdPropertyName: any,
  ): string {
    return snakeCase(parentTableName + '_' + parentTableIdPropertyName);
  }

  eagerJoinRelationAlias(alias: string, propertyPath: string): string {
    return alias + '__' + propertyPath.replace('.', '_');
  }
}

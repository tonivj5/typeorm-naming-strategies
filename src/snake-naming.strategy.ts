// Credits to @recurrence
// https://gist.github.com/recurrence/b6a4cb04a8ddf42eda4e4be520921bd2

import { DefaultNamingStrategy, NamingStrategyInterface } from 'typeorm';
import { snakeCase } from 'typeorm/util/StringUtils';
import {Table} from "typeorm/schema-builder/table/Table";

export class SnakeNamingStrategy
  extends DefaultNamingStrategy
  implements NamingStrategyInterface {
  tableName(className: string, customName: string): string {
    return customName ? customName : snakeCase(className);
  }

  columnName(
    propertyName: string,
    customName: string,
    embeddedPrefixes: string[],
  ): string {
    return (
      snakeCase(embeddedPrefixes.concat('').join('_')) +
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

  foreignKeyName(tableOrName: Table | string, columnNames: string[], _referencedTablePath?: string, _referencedColumnNames?: string[]): string {
    const name = _referencedTablePath + '_' + columnNames.join('_');
    return`fk_${name}`
  }

  indexName(tableOrName: Table | string, columnNames: string[], where?: string): string {
    const name = tableOrName instanceof  Table ? tableOrName.name : tableOrName;
    return`index_${name}_${columnNames.join('_')}`
  }

  primaryKeyName(tableOrName: Table | string, columnNames: string[]): string {
    const name = tableOrName instanceof  Table ? tableOrName.name : tableOrName;
    return `pk_${name}_${columnNames.join('_')}`;
  }

  uniqueConstraintName(tableOrName: Table | string, columnNames: string[]): string {
    const name = tableOrName instanceof  Table ? tableOrName.name : tableOrName;
    return `unique_${name}_${columnNames.join('_')}`;
  }

  relationConstraintName(tableOrName: Table | string, columnNames: string[], where?: string): string {
    const name = tableOrName instanceof  Table ? tableOrName.name : tableOrName;
    return `rel_${name}_${columnNames.join('_')}`;
  }
}

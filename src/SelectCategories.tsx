import { useState } from "react";
import { MenuItem } from "@blueprintjs/core";
import { MultiSelect } from "@blueprintjs/select";
import categoriesImport from './assets/categories.json'
import { toggle } from "./utils/toggle";

const removeSeries = [
  // Due to null data
  'Logi',
  'Hemförsäkr., banktjänster, utbildn.',

  'TV-licens',
  'Konsumentprisindex totalt',
  'H Varor',
  'H Tjänster exkl. bostad',
  'H Bostad', 'H Livsmedel, svenska',
  'H Övriga varor, inhemsk produktion',
  'H Tjänster',
  "H Lägenheter, hyra",
  "H Inhemsk prod, varor och tjänster",
  "H Övrigt, egnahem",
  "H Importeradevaror och tjänster",
  "H Räntor egnahem",
]

export type Category = { label: string, data: { x: string, weight: number, index: number }[] }
export const categoriesTyped = categoriesImport as Category[]

export const categories = categoriesTyped.filter(series => !removeSeries.includes(series.label))

export function SelectCategories (props: {
  selectedItems: Category[]
  setSelectedItems(items: Category[]): void 
}) {
  const selectedIds = props.selectedItems.map(item => item.label)

  return <MultiSelect<Category>
    resetOnSelect={false}
    resetOnQuery={false}
    itemPredicate={(query, item) => item.label.toLocaleLowerCase().includes(query.toLowerCase())}
    items={categories}
    itemRenderer={(item, { handleClick, modifiers }) => <MenuItem
      {...modifiers}
      icon={selectedIds.includes(item.label) ? 'small-tick' : null}
      onClick={handleClick}
      key={item.label}
      text={item.label}
      shouldDismissPopover={false}
    />}
    selectedItems={props.selectedItems}
    onItemSelect={item => props.setSelectedItems(toggle(item, props.selectedItems))}
    tagRenderer={item => item.label}
    onRemove={item => props.setSelectedItems(toggle(item, props.selectedItems))}
  />
}
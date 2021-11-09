import {
  ALL_FOODS,
  createBreadcrumb,
  FOUNDATION_FOOD,
  USDA,
} from "../utilities/breadcrumbs"
import { spaceToDashes } from "../utilities/helpers"
import { FoundationFood, RDI } from "../../shared/types"

const path = require("path")
const ff_nutrition_facts = require("../../../src/data/foundation_food_nutrition_facts.json")
const rdis: RDI[] = require("../../../src/data/rdi.json")

interface NutritionFactFnType {
  path: string
  component: string
  context: {}
}

type CreatePageFnProps = {
  createPageFunction: (fnType: NutritionFactFnType) => void
}

const generateFoundationFoodNutritionFactTables = ({
  createPageFunction,
}: CreatePageFnProps) => {
  const template = path.resolve(
    "./src/templates/usda/FoundationFoodNutritionFacts.tsx"
  )
  ff_nutrition_facts.forEach((food: FoundationFood) => {
    const pagePath = spaceToDashes(food["name"].toString())
    createPageFunction({
      path: pagePath,
      component: template,
      context: {
        food,
        rdis,
        breadcrumbs: [
          ALL_FOODS,
          USDA,
          FOUNDATION_FOOD,
          createBreadcrumb(FOUNDATION_FOOD, food.category),
        ],
      },
    })
  })
}

type FoundationFoodPageProps = CreatePageFnProps & {
  data: [{ name: string; category: string }]
}
const generateFoundationFoodPage = ({
  createPageFunction,
  data,
}: FoundationFoodPageProps) => {
  const template = path.resolve(
    "./src/templates/usda/food_sources/FoundationFood.tsx"
  )
  const foundationFoodWithCategories = data.reduce((acc, node) => {
    const foods = acc.has(node.category)
      ? [...(acc.get(node.category) as string[]), node.name]
      : [node.name]
    acc.set(node.category, foods)
    return acc
  }, new Map<string, string[]>())
  createPageFunction({
    path: "foundation-foods",
    component: template,
    context: {
      foundationFoodWithCategories: Object.fromEntries(
        foundationFoodWithCategories
      ),
    },
  })
}

module.exports = {
  generateFoundationFoodNutritionFactTables,
  generateFoundationFoodPage,
}

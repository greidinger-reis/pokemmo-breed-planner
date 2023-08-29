"use client"
import { getPokemonByName } from "@/actions/pokemon-by-name"
import { Button } from "@/components/ui/button"
import { usePokemonToBreed } from "@/context/hooks"
import { PokemonSelectList } from "@/data/types"
import { columnsPerRow } from "./consts"
import { PokemonSelect } from "./select"
import { BreedNodeSetter, Position } from "./types"
import { useBreedMap } from "./use-breed-map"

function PokemonTree(props: {
  pokemons: PokemonSelectList
  getPokemonByName: typeof getPokemonByName
}) {
  const { pokemon, nature, ivs } = usePokemonToBreed()

  const ivsArray = Object.values(ivs).filter(Boolean)
  const numberOf31IvPokemon = ivsArray.length as 2 | 3 | 4 | 5

  const generations = (
    nature ? numberOf31IvPokemon! + 1 : numberOf31IvPokemon
  ) as 2 | 3 | 4 | 5 | 6

  const breedMap = useBreedMap({
    selectedPokemonIVs: ivs!,
    nature,
    pokemonToBreed: {
      pokemon: pokemon!,
      nature,
      ivs: ivsArray,
      parents: null,
      gender: null,
    },
    numberOf31IvPokemon,
  })

  function setBreedNode(key: Position, value: BreedNodeSetter) {
    const node = breedMap.get(key)
    if (!node) return

    breedMap.set(key, {
      ...node,
      ...value,
    })
  }

  return (
    <div className="flex flex-col-reverse items-center gap-32">
      {Array.from({ length: generations }).map((_, row) => (
        <div className="flex" key={`row:${row}`}>
          {Array.from({ length: columnsPerRow[row] }).map((_, column) => (
            <div key={`row:${row}col:${column}`}>
              {props.pokemons && (
                <PokemonSelect
                  getPokemonByName={getPokemonByName}
                  pokemons={props.pokemons}
                  position={`${row},${column}` as Position}
                  set={setBreedNode}
                  get={breedMap.get}
                />
              )}
            </div>
          ))}
        </div>
      ))}
      <Button className="mt-4" onClick={() => console.log(breedMap.map)}>
        Debug
      </Button>
    </div>
  )
}

export function PokemonToBreedTree(props: {
  pokemons: PokemonSelectList
  getPokemonByName: typeof getPokemonByName
}) {
  const ctx = usePokemonToBreed()
  if (!ctx.pokemon || !ctx.ivs) return null
  return (
    <PokemonTree
      getPokemonByName={getPokemonByName}
      pokemons={props.pokemons}
    />
  )
}

const searchById = (node, term) => {
  if (node.id && node.id === term) {
    return [node]
  }

  if (node.clients) {
    let results = []
    for (const client of node.clients) {
      results = results.concat(searchById(client, term))
    }
    return results
  }

  return []
}

export { searchById }



module.exports = {
   toUniversalIds(ids) {
    return ids.map(id => {
        return { id: id }
    });
   } 
}
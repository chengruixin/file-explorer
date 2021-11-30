const createMapWithCache = (capacity = 2000) => {
    const cacheMap = new Map();

    return {
        set: (key, val) => {
            if (cacheMap.size >= capacity) {
                for(const key of cacheMap.keys()) {
                    console.log('removing', key);
                    const res = cacheMap.delete(key);

                    if (res) {
                        break;
                    } else {
                        console.log('delete key', key, 'failed, try next key');
                    }
                }
            }

            // save key, val
            cacheMap.set(key, val);
        },
        get: key => cacheMap.get(key),
        values: () => cacheMap.values(),
        keys: () => cacheMap.keys(),
        entries: () => cacheMap.entries(),
        has: key => cacheMap.has(key),
    }
};

module.exports = {
    createMapWithCache
}
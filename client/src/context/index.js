import React, { useEffect, useState, useContext } from 'react';

const QueryDataContext = React.createContext()
export const useQueryDataContext = () => useContext(QueryDataContext);

export default function IndexContext({children}){
    const [queryData, setQueryData] = useState([]);

    return (
        <QueryDataContext.Provider value={[queryData, setQueryData]}>
            {children}
        </QueryDataContext.Provider>
    )
}
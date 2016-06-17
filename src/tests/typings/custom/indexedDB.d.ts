interface IIndexedDBStatic {
    openStore(storeName: string, callBack: (store) => void, mode?);
}
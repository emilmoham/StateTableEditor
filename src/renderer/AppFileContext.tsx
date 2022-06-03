import { createContext } from 'react';
import AppTable from './Models/AppTable';

const AppTableContext = createContext([] as AppTable[]);

export default AppTableContext;

import { createStore, combineReducers } from 'redux';
import Renderer from './RendererStore';

const Combi = combineReducers({
  Renderer
});
export default createStore(Combi);

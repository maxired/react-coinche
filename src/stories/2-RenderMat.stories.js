import React from 'react';
import { action } from '@storybook/addon-actions';
import { RenderMat } from '../components/RenderMat';
import { STEP_WATCH_CARDS } from '../Constants';

export default {
  title: 'RenderMat',
  component: RenderMat,
};

export const EmptyMat = () => <RenderMat step={{
    name: STEP_WATCH_CARDS,
    mat: [],
    positions: { 
        N : 'PerdPas',
        S : 'JEan',
        E : 'IL',
        W : 'Kanny',
    },
    position: 'E',
    turnPosition: 'N',
}} />

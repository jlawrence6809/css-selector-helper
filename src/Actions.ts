
export const AttributeButtonClick = 'AttributeButtonClick';

interface AttributeButtonClickAction {
    type: typeof AttributeButtonClick;
    payload: {
        metaPressed: boolean,
        selector: string,
        rowIdx: number,
        buttonIdx: number
    };
}

export type ActionTypes = AttributeButtonClickAction;
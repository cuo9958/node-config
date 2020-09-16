import React from 'react';
import './index.less';

interface ITag {
    val: string;
}

export default function Tag(props: ITag) {
    return <div className="tag">{props.val}</div>;
}

export function TagError(props: ITag) {
    return <div className="tag-error">{props.val}</div>;
}

export function TagSuccess(props: ITag) {
    return <div className="tag-success">{props.val}</div>;
}

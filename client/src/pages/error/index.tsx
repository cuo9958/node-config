import React from 'react';
import Button from '@material-ui/core/Button';

export default function (props: any) {
    function test() {
        props.history.push('/test');
    }
    return (
        <div>
            404
            <Button variant="contained" size="small" color="primary" onClick={() => test()}>
                测试
            </Button>
        </div>
    );
}

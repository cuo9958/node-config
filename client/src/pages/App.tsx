import React from 'react';
import Button from '@material-ui/core/Button';
import { inject } from 'mobx-react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Pagination from '@material-ui/lab/Pagination';
import './App.less';

@inject((models: any) => ({
    nickname: models.user.nickname,
}))
export default class App extends React.Component<any> {
    render() {
        return (
            <div className="App">
                <Button variant="contained" size="small" color="primary" onClick={() => this.test()}>
                    测试{this.props.nickname}
                </Button>
                <TableContainer>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell>标题1</TableCell>
                                <TableCell>标题2</TableCell>
                                <TableCell>标题3</TableCell>
                                <TableCell width={100} align="center">
                                    标题4
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell>test</TableCell>
                                <TableCell>test</TableCell>
                                <TableCell>test</TableCell>
                                <TableCell>
                                    <Button color="primary" onClick={() => this.test()}>
                                        编辑
                                    </Button>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>test</TableCell>
                                <TableCell>test</TableCell>
                                <TableCell>11</TableCell>
                                <TableCell>
                                    <Button color="primary" onClick={() => this.test()}>
                                        编辑
                                    </Button>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
                <div className="table-footer">
                    <Pagination className="pagination" count={10} shape="rounded" />
                </div>
            </div>
        );
    }

    test() {
        this.props.history.push('/test');
    }
}

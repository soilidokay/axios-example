import React, { Component } from 'react'
import { IComment } from '../../Models'
import { commentService } from '../../services/CommentService'

interface ICommentState {
    data: IComment[] | null
}
interface ICommentProp { }
export default class Comment extends Component<ICommentProp, ICommentState> {
    constructor(props) {
        super(props)
        this.state = {
            data: null
        }
    }
    renderComment = (data: IComment[]) => {
        return data.map((item, index) => {
            return (
                <div key={item.id} style={{ border: "1px solid blue", padding: "10px" }}>
                    <div>{item.id}</div>
                    <div>{item.message}</div>
                    <div>{item.dateCreated}</div>
                </div>
            )
        })
    }
    componentDidMount(): void {
        commentService.All().then((data) => this.setState({ data }))
    }
    render() {
        return <div style={{ display: 'flex', flex: 1, flexDirection: 'column', alignItems: 'center' }}>
            {this.state.data ? this.renderComment(this.state.data) : <div>Loading...</div>}
        </div>
    }
}

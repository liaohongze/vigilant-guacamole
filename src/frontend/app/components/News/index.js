import React, { Component } from 'react'
import FontAwesome from 'react-fontawesome'
import Client from '../../common/Client'
import {auth} from '../../common/Auth'
import { formatDate } from '../../utils/tools'
import ListItem from './ListItem'
import Toolbar from '../shared/Toolbar'
import NoMore from '../shared/NoMore'
import QueueAnim from 'rc-queue-anim'

export default class News extends Component {
  state = {
    totalPage: 1,
    pageSize: 16,
    activePage: 1,
    loading: false,
    articles: []
  }

  refreshData = (page, size) => {
    this.setState({ loading: true })
    Client.getArticles(page, size, auth.getToken(), result => {
      if (!result.errored) {
        this.setState({
          loading: false,
          totalPage: Math.ceil(result.object.total / this.state.pageSize),
          articles: this.state.articles.concat(result.object.list),
          activePage: this.state.activePage + 1
        })
      }
    })
  }

  arrivedBottom = () => {
    if (this.refs.newsBox.scrollTop + this.refs.newsBox.clientHeight === this.refs.newsBox.scrollHeight) {
      if (this.state.activePage <= this.state.totalPage) {
        this.refreshData(this.state.activePage, this.state.pageSize)
      }
    }
  }

  componentDidMount() {
    this.refs.newsBox.addEventListener('scroll', this.arrivedBottom)
    this.refreshData(this.state.activePage, this.state.pageSize)
  }

  componentWillUnmount() {
    this._isMounted = false
    this.refs.newsBox.removeEventListener('scroll', this.arrivedBottom)
  }

  render() {
    const { loading, articles } = this.state
    return (
      <div className='news toolbar-page' ref='newsBox'>
        <Toolbar link='/' title='游戏公告' />
        <div className='news-list toolbar-page-content'>
          <QueueAnim delay={300} className='queue-simple'>
            {
              articles.length === 0
                ? (loading ? null : <NoMore />)
                : (
                  articles.map((item, index) => {
                    return <ListItem key={index} link={'/news/' + item.id} title={item.title} data={formatDate(item.created, 'YYYY-MM-DD')} />
                  })
                )
            }
          </QueueAnim>
          {
            loading ? <div className='loading'><FontAwesome className='super-crazy-colors' name='spinner' spin size='lg' /></div> : null
          }
        </div>
      </div>
    )
  }
}
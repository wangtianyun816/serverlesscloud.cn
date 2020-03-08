import * as React from 'react'
import { StaticQuery, useStaticQuery, graphql } from 'gatsby'
import { Box, List, Text, ListItemWithNoStyleType } from '@src/components/atoms'
import styled from 'styled-components'
import { display, color, textAlign, TextAlignProps } from 'styled-system'
import { Link as InternalLink } from 'gatsby'
import ExternalLink from '../Link/ExternalLink'
import theme from '@src/constants/theme'
import { getSearch } from '@src/utils/search'
import { Position } from '../atoms/Position/index';

const NavListItem = styled(ListItemWithNoStyleType)`
  ${display}
  ${color}

  div {
    transition: all 0.3s ease;
    padding: 0 20px;
    font-size: 15px;
  }

  &:hover {
    div {
      color: ${theme.colors.white};
    }
  }
`

const BoxWithTextAlign = styled(Box) <TextAlignProps>`
  ${textAlign}
`

const navList: { title: string; link: string; isInternal?: boolean }[] = [
  {
    title: '最佳实践',
    link: '/best-practice',
    isInternal: true,
  },
  {
    title: '组件',
    link: 'https://serverless.com/cn/components/',
  },
  {
    title: '文档',
    link: 'https://serverless.com/cn/framework/docs/',
  },
  {
    title: '博客',
    link: '/blog',
    isInternal: true,
  },
  {
    title: '资源',
    link: '/resource',
    isInternal: true,
  },
  {
    title: '论坛',
    link: '/forum',
    isInternal: true,
  },
  {
    title: '关于',
    link: '/about',
    isInternal: true,
  },
]

interface Props {
  isActive: boolean
  isDesktopView: boolean,
  searchList: []
}

interface State {
  searchVisible: boolean,
  searchContnet: string,
}

function Blogs(props) {

  const query = graphql`query { blogs: allMarkdownRemark( sort: { fields: frontmatter___date, order: DESC } limit: 999999 filter: { fileAbsolutePath: { regex: "//blog//" } frontmatter: { categories: { nin: "best-practice" } } } ) { edges { node { id frontmatter { title thumbnail thumbnail
  authors description date } fileAbsolutePath fields { slug } } } } } `
  return (
    <StaticQuery
      query={query}
      render={({ blogs }: {
        blogs: any
      }) => {
        let searchKeys = getSearch(props.value || '', blogs.edges, [])
        if (searchKeys.length > 0) {
          return (
            <div className="scf-header-search__panel">
              <ul className="scf-header-search-result-list">
                {blogs.edges.map((item, index) => {
                  return searchKeys.map((itemSearchKey, indexSearchKey) => {
                    if (item.node.id == itemSearchKey) {
                      return (
                        <li className="scf-header-search-result-list__item">
                          <a target="_blank" href={item.node.fields.slug}>
                            <p className="scf-header-search-result-list__item-title">{item.node.frontmatter.title}</p>
                            <p
                              className="scf-header-search-result-list__item-info">{item.node.frontmatter.description}</p>
                          </a>
                        </li>
                      )
                    }
                  })
                })
                }
              </ul>
            </div>
          )
        }
      }}
    />
  )
}


export default class NavList extends React.Component<Props, State> {

  constructor(props) {
    super(props)
    this.state = {
      searchVisible: false,
      searchContnet: '',
    }
    this.search = null
  }

  changeSearch() {
    this.setState({
      searchVisible: !this.state.searchVisible,
    }, () => {
      if (this.search) {
        this.setState({
          searchContnet: this.search.value,
        })
      }
    })
  }

  render() {
    const { searchVisible, searchContnet } = this.state
    const { isActive, isDesktopView } = this.props
    const isMobileNavListDisplay = () => (isActive ? 'block' : 'none')

    const navListBoxWidth = isDesktopView ? 0.6 : 1
    return (
      <BoxWithTextAlign
        width={navListBoxWidth}
        bg={theme.colors.black}
        display={[
          isMobileNavListDisplay(),
          isMobileNavListDisplay(),
          isMobileNavListDisplay(),
          'block',
          'block',
          'block',
          'block',
        ]}
        textAlign={isDesktopView ? 'right' : 'left'}
      >

        <List p={0} mr={0} mb={0} style={{position:'relative'}}>
          {navList.map(({ title, link, isInternal }, index) => {
            const Link = isInternal
              ? InternalLink
              : ExternalLink
            return (
              <NavListItem
                onClick={() => {
                  if (link === '/') {
                    ;(window as any).MtaH5.clickStat('homelink')
                  }
                }}
                key={index}
                display={['block', 'block', 'block', 'inline-block']}
              >
                <Link to={link}>
                  <Text color={theme.colors.gray_text} style={{ fontSize: 15 }}>{title}</Text>
                </Link>
              </NavListItem>
            )
          })}
          {searchVisible ?
            <div className="scf-header-search">
              <div className="scf-header-search__input-wrap" style={{ display: 'flex' }}>
                <button className="scf-header-search__search-btn"><i className="scf-icon scf-icon-search-white"></i>
                </button>
                <input ref={(r) => this.search = r} onInput={(e) => {
                  this.setState({
                    searchContnet: e.target.value,
                  })
                }} type="text" placeholder="搜索文章或关键词" className="scf-header-search__input"/>
                <button className="scf-header-search__clear-btn" onClick={() => this.changeSearch()}><i
                  className="scf-icon scf-icon-clear"></i></button>
                <Blogs value={searchContnet}/>
              </div>
            </div>
            :
            <NavListItem
              key={'search'}
              display={['block', 'block', 'block', 'inline-block']}
              onClick={() => this.changeSearch()}
            >
              <Text color={theme.colors.gray_text} style={{ fontSize: 15 }}><i
                className="scf-icon scf-icon-search-white"></i></Text>
            </NavListItem>}

        </List>
      </BoxWithTextAlign>
    )
  }
}

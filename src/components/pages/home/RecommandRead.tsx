import * as React from 'react'
import {Box} from '@src/components/atoms'
import {StaticQuery, graphql, Link} from 'gatsby'
import {Blog, GraphqlBlogResult} from '@src/types'
import './LatestBlogs.css'

type BestPractice = Blog

interface Props {
  blogs : BestPractice[]
}

function BlogCard({blog} : {
  blog: Blog
}) {
  return (
    <Box className="scf-article-item scf-article-item--block">
      <Link to={blog.node.fields.slug}>
        <Box className="scf-article-item__img">
          <Box className="scf-article-item__img-inner">
            <img src={blog.node.frontmatter.thumbnail} alt=""/>
          </Box>
        </Box>
        <Box className="scf-article-item__content">
          <Box className="scf-article-item__statistics">
            <span className="scf-article-item__statistics-item">
              <i className="scf-icon scf-icon-view"></i>
              13.3K</span>
            {blog.node.frontmatter.authors} 
            · {blog
              .node
              .frontmatter
              .date
              .slice(2, 10)}
            · 阅读大约需要{blog.node.timeToRead}分钟</Box>
          <Box className="scf-article-item__title">
            <h4>{blog.node.frontmatter.title}</h4>
          </Box>
          <Box className="scf-article-item__intro">{blog.node.frontmatter.description}</Box>
        </Box>
      </Link>
    </Box>
  )
}

function Blogs() {
  const query = graphql ` query { blogs: allMarkdownRemark( sort: { fields: frontmatter___date, order: DESC } limit: 6 filter: { fileAbsolutePath: { regex: "//best-practice//" } } ) { edges { node { id frontmatter { title thumbnail description date authors } fileAbsolutePath timeToRead fields { slug } } } } } `
  return (
    <StaticQuery
      query={query}
      render={({blogs} : {
      blogs: GraphqlBlogResult
    }) => {
      return (
        <Box className="scf-box__body">
          {blogs
            .edges
            .map(blog => (<BlogCard key={blog.node.id} blog={blog}/>))}
        </Box>
      )
    }}/>
  )
}

export default function () {
  return (
    <Box className="scf-grid__item-16">
      <Box className="scf-grid__box">
        <Box className="scf-box scf-home-blog">
          <Box className="scf-box__header">
            <Box className="scf-box__header-title">
              <h3>推荐阅读</h3>
            </Box>
            <Box className="scf-box__header-more">
              <Link to="/best-practice">
               更多推荐 &gt;
              </Link>
            </Box>
          </Box>
          <Blogs/>
        </Box>
      </Box>
    </Box>
  )
}
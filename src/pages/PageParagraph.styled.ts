import styled from 'styled-components'

const PageParagraphWrapper = styled.p`
  display: flex;

  & svg {
    margin: 0.5rem 0 0 0.1rem;
    min-width: 2rem;
    max-width: 2rem;
  }

  & button {
    text-decoration: underline;
    color: ${({ theme }) => theme.colors.dark};
  }
`

export default PageParagraphWrapper

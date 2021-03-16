import { Link } from 'react-router-dom';
import { Logo, Title, HeaderContainer } from '../style/Header';

export function Header() {
  return (
    <HeaderContainer>
      <Link to="/">
        <Logo />
      </Link>
      <Link to="/" className="title">
        <Title>Responsum</Title>
      </Link>
    </HeaderContainer>
  );
}

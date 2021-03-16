import { Link } from 'react-router-dom';
import { Logo, Title, HeaderContainer } from '../style/Header';
import { BASE_PATH } from '../utils/Paths';

export function Header() {
  return (
    <HeaderContainer>
      <Link to={BASE_PATH}>
        <Logo />
      </Link>
      <Link to={BASE_PATH} className="title">
        <Title>Responsum</Title>
      </Link>
    </HeaderContainer>
  );
}

import Button from './UI/Button';
import logoImg from '../assets/logo.jpg';

export default function Header() {
  return (
    <header id='main-header'>
      <div id='title'>
        <img src={logoImg} alt='Fast Food Franchise' />
        <h1>SubwayFood</h1>
      </div>
      <nav>
        <Button textOnly>Cart (0)</Button>
      </nav>
    </header>
  );
}

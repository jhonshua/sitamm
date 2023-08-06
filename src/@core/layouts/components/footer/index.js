// ** Icons Import
const Footer = () => {
  return (
    <p className='clearfix mb-0'>
      <span className='float-md-start d-block d-md-inline-block mt-25'>
        COPYRIGHT © {new Date().getFullYear()}{' '}
        <a href='https://hybrido.studio/' target='_blank' rel='noopener noreferrer'>
          Hybrido Studio
        </a>
        <span className='d-none d-sm-inline-block'>, Todos los derechos reservados</span>
      </span>
    </p>
  )
}

export default Footer


import { useEffect, ReactNode, RefObject } from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 100dvh;
  z-index: 1000;
  background-color: white;
  display: flex;
  flex-direction: column;
`

const FloatingAction = styled.div`
  position: absolute;
  bottom: 24px;
  right: 16px;
  z-index: 10;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #eee;
  flex-shrink: 0;
`

const BackButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 4px 8px;
  margin-right: 8px;
  color: #3273dc;
`

const Title = styled.div`
  font-size: 1.1rem;
  font-weight: 500;
  flex: 1;
`

const HeaderRight = styled.div`
  margin-left: auto;
`

const SubHeader = styled.div`
  flex-shrink: 0;
`

const Content = styled.div`
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
`

export const OverlayOption = styled.div<{ $color?: string; $isSelected?: boolean }>`
  padding: 14px 16px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 1rem;
  cursor: pointer;
  background-color: ${(props) => props.$color || 'white'};
  font-weight: ${(props) => (props.$isSelected ? '600' : 'normal')};

  &:active {
    opacity: 0.7;
  }
`

export const OverlaySearchInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: none;
  border-bottom: 2px solid #3273dc;
  font-size: 1rem;
  outline: none;
  box-sizing: border-box;
`

interface FullscreenOverlayProps {
  title: string
  onClose: () => void
  children: ReactNode
  headerRight?: ReactNode
  subHeader?: ReactNode
  floatingAction?: ReactNode
}

export default function FullscreenOverlay({
  title,
  onClose,
  children,
  headerRight,
  subHeader,
  floatingAction,
}: FullscreenOverlayProps) {
  useEffect(() => {
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [])

  return ReactDOM.createPortal(
    <Backdrop>
      <Header>
        <BackButton onClick={onClose}>←</BackButton>
        <Title>{title}</Title>
        {headerRight && <HeaderRight>{headerRight}</HeaderRight>}
      </Header>
      {subHeader && <SubHeader>{subHeader}</SubHeader>}
      <Content>{children}</Content>
      {floatingAction && <FloatingAction>{floatingAction}</FloatingAction>}
    </Backdrop>,
    document.body,
  )
}

interface OverlayWithSearchProps {
  title: string
  onClose: () => void
  searchRef?: RefObject<HTMLInputElement | null>
  searchValue: string
  onSearchChange: (value: string) => void
  searchPlaceholder?: string
  headerRight?: ReactNode
  floatingAction?: ReactNode
  children: ReactNode
}

export function OverlayWithSearch({
  title,
  onClose,
  searchRef,
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Поиск...',
  headerRight,
  floatingAction,
  children,
}: OverlayWithSearchProps) {
  return (
    <FullscreenOverlay
      title={title}
      onClose={onClose}
      headerRight={headerRight}
      floatingAction={floatingAction}
      subHeader={
        <OverlaySearchInput
          ref={searchRef}
          type="text"
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      }
    >
      {children}
    </FullscreenOverlay>
  )
}

import styled from 'styled-components'

export const MapTopControlsWrapper = styled.div<{ visible?: boolean }>`
  opacity: ${({ visible }) => (visible ? 1 : 0)};
  transition: opacity 2s ease-in-out;
  position: absolute;
  top: 10px;
  left: 12px;
  display: flex;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    top: 2px;
  }

  & button {
    font-variant: small-caps;
    margin: 0;
  }
  & button > em {
    font-variant: normal;
    @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
      display: none;
    }
  }
`

export const MapTopControlsSection = styled.div`
  margin-right: 20px;
`

export const MapTopControlsSectionTitle = styled.div`
  font-style: italic;
  font-size: ${({ theme }) => theme.fontSizes.small};
`

export const SpeciesDropdown = styled.div`
  position: relative;
  width: 260px;
`

export const SpeciesDropdownButton = styled.button`
  width: 100%;
  height: 38px;
  padding: 0 12px;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  background: white;
  color: #222;

  font: inherit;
  text-align: left;
  cursor: pointer;

  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;

  &:hover {
    border-color: rgba(0, 0, 0, 0.3);
  }

  &:focus {
    outline: none;
    border-color: #2e7d32;
    box-shadow: 0 0 0 2px rgba(46, 125, 50, 0.15);
  }
`

export const SpeciesDropdownChevron = styled.span<{ open: boolean }>`
  width: 7px;
  height: 7px;

  border-right: 1.5px solid currentColor;
  border-bottom: 1.5px solid currentColor;

  transform: rotate(${({ open }) => (open ? '225deg' : '45deg')});
  transition: transform 0.15s ease;
`

export const SpeciesDropdownMenu = styled.div`
  position: absolute;
  z-index: 20;
  top: calc(100% + 4px);
  left: 0;
  width: 100%;
  max-height: 320px;

  overflow-y: auto;

  padding: 4px;

  background: white;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 4px;

  box-shadow:
    0 4px 12px rgba(0, 0, 0, 0.12),
    0 1px 3px rgba(0, 0, 0, 0.08);

  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 3px;
  }
`

export const SpeciesDropdownOption = styled.button<{ active: boolean }>`
  width: 100%;
  min-height: 34px;

  display: flex;
  align-items: center;

  padding: 7px 9px;

  border: 0;
  border-radius: 3px;

  background: ${({ active }) =>
    active ? 'rgba(46, 125, 50, 0.1)' : 'transparent'};

  color: ${({ active }) => (active ? '#2e7d32' : '#333')};

  font: inherit;
  font-size: 14px;
  font-weight: ${({ active }) => (active ? 600 : 400)};
  text-align: left;

  cursor: pointer;

  &:hover {
    background: ${({ active }) =>
      active ? 'rgba(46, 125, 50, 0.14)' : 'rgba(0, 0, 0, 0.05)'};
  }
`


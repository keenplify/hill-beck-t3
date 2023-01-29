import dynamic from 'next/dynamic';
import React from 'react';
import type { ReactNode } from 'react';
import { useLayoutEffect, useState } from 'react'

const withNoSSR = (Component: React.FunctionComponent) => dynamic(
  () => Promise.resolve(Component),
  { ssr: false },
);

export default withNoSSR;

const DefaultOnSSR: React.FC = () => null

export const NoSSR: React.FC<{ children: ReactNode; onSSR?: ReactNode }> = ({
  children, onSSR = <DefaultOnSSR /> }) => {
  const [onBrowser, setOnBrowser] = useState(false)
  useLayoutEffect(() => {
    setOnBrowser(true)
  }, [])
  return <>{onBrowser ? children : onSSR} </>
}
import {type ReactNode, type CSSProperties, useEffect, Fragment} from "react";
import {usePage} from "../../contexts/PageContext";

function parsePageKey(pageKey: string): {
  pageNum: number;
  groupKey: string | undefined;
} {
  const slashIndex = pageKey.indexOf("/");
  if (slashIndex === -1) {
    return {pageNum: parseInt(pageKey, 10), groupKey: undefined};
  }
  const base = parseInt(pageKey.substring(0, slashIndex), 10);
  const suffix = parseInt(pageKey.substring(slashIndex + 1), 10);
  const pageNum = base + suffix - 1;
  const groupKey = pageKey.substring(0, slashIndex);
  return {pageNum, groupKey};
}

interface PageBlockProps {
  page: string;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function PageBlock({page, children, className, style}: PageBlockProps) {
  const {currentPage, registerPage, unregisterPage, getActivatedReplacement} =
    usePage();

  const {pageNum, groupKey} = parsePageKey(page);

  useEffect(() => {
    registerPage(pageNum, groupKey);
    return () => {
      unregisterPage(pageNum, groupKey);
    };
  }, [pageNum, groupKey, registerPage, unregisterPage]);

  if (!groupKey) {
    if (currentPage < pageNum) return null;
    if (!children) return <Fragment />;
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }

  const activated = getActivatedReplacement(groupKey);
  if (activated === -1) return null;
  if (pageNum !== activated) return null;
  if (!children) return <Fragment />;

  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
}
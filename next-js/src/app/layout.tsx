"use client";

import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import "@/styles/globals.css";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const siteTitle = "WKND";
  const navigation = [{ name: "Adventures", href: "/" }];

  const pathname = usePathname();

  const isCurrentPage = (path: string) => {
    return path === "/" ? pathname === "/" : pathname.indexOf(path) === 0;
  };

  const classNames = (...classes: string[]) => {
    return classes.filter(Boolean).join(" ");
  };

  return (
    <html>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="AEM WKND built in Next.js" />
        <meta
          property="og:image"
          content={`${process.env.NEXT_PUBLIC_URL}/wknd-logo-dk.svg`}
        />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="cq:pagemodel_router" content="disabled" />
      </Head>

      <body>
        <Disclosure as="nav" className="bg-gray-100">
          {({ open }) => (
            <>
              <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
                <div className="relative flex items-center justify-between h-16">
                  <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                    {/* Mobile menu button*/}
                    <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-800 hover:text-gray-700 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XMarkIcon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      ) : (
                        <Bars3Icon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      )}
                    </Disclosure.Button>
                  </div>

                  <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                    <div className="flex-shrink-0 flex items-center">
                      <Link href="/">
                        <Image
                          className="block lg:hidden h-8 w-auto"
                          src={
                            process.env.NEXT_PUBLIC_URL + "/wknd-logo-dk.svg"
                          }
                          alt="WKND"
                          height="10000"
                          width="10000"
                        />
                        <Image
                          className="hidden lg:block h-8 w-auto"
                          src={
                            process.env.NEXT_PUBLIC_URL + "/wknd-logo-dk.svg"
                          }
                          alt="WKND"
                          height="10000"
                          width="10000"
                        />
                      </Link>
                    </div>
                    <div className="hidden sm:block sm:ml-6">
                      <div className="flex space-x-4">
                        {navigation.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            aria-current={
                              isCurrentPage(item.href) ? "page" : undefined
                            }
                            className={classNames(
                              isCurrentPage(item.href)
                                ? "bg-yellow-300 text-gray-700"
                                : "text-gray-800 hover:bg-yellow-200 hover:text-gray-700",
                              "px-3 py-2 rounded-md text-sm font-medium",
                            )}
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Disclosure.Panel className="sm:hidden">
                <div className="px-2 pt-2 pb-3 space-y-1">
                  {navigation.map((item) => (
                    <Disclosure.Button
                      key={item.name}
                      as="a"
                      href={item.href}
                      className={classNames(
                        isCurrentPage(item.href)
                          ? "bg-yellow-300 text-gray-700"
                          : "text-gray-800 hover:bg-yellow-200 hover:text-gray-700",
                        "block px-3 py-2 rounded-md text-base font-medium",
                      )}
                      aria-current={
                        isCurrentPage(item.href) ? "page" : undefined
                      }
                    >
                      {item.name}
                    </Disclosure.Button>
                  ))}
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>

        <main>{children}</main>

        <footer className="bg-gray-200 text-center lg:text-left">
          <div className="text-gray-700 text-center p-4">
            &copy;2022,{" "}
            <a className="text-gray-800" href="https://wknd.site/">
              WKND Site.
            </a>
          </div>
        </footer>
      </body>
    </html>
  );
}

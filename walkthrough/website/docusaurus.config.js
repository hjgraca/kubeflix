/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'kubeflix',
  tagline: 'Built to demonstrate a microservices application running on Kubernetes. It is composed of 10 microservices written in different languages that talk to each other over http.',
  url: 'https://hjgraca.github.io',
  baseUrl: '/kubeflix/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'hjgraca', // Usually your GitHub org/user name.
  projectName: 'kubeflix', // Usually your repo name.
  themeConfig: {
    navbar: {
      title: 'Kubeflix',
      logo: {
        alt: 'Kubeflix Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          to: 'docs/',
          activeBasePath: 'docs',
          label: 'Workshop',
          position: 'left',
        },
        {
          href: 'https://github.com/hjgraca/kubeflix',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Getting Started',
              to: 'docs/',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Kubeflix, Inc. Built with Docusaurus.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl:
            'https://github.com/hjgraca/kubeflix/edit/master/walkthrough/website/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};

# Video Explorer

A ReactJS app to browse the host file system that shows metadata about video such as duration and size.

![Demonstration](demonstration.png)

# How to run

You must have [Nodejs+npm](https://nodejs.org/), [ffmpeg](https://www.ffmpeg.org/) installed to run this program. You may use the following commands in your terminal if you have [git](https://git-scm.com/downloads) installed:

```
git clone https://github.com/GuilhermeRossato/video-file-explorer.git
cd video-file-explorer
npm run start
```

The program detects whether or not the dependencies are missing and runs `npm install` for you before executing, so it might take a while the first time.

# Component Hierarchy

    - App
      - Header
      - FileExplorer
        - NavigationBarWrapper
          - NavigationBar

# Adapters

 - FileSystemAdapter: Request file system data such as file lists and cwd.

 - VideoAdapter: Resolves video type from file name and request video metadata.

# Technologies

 - ReactJS
 - Material Design
 - ExpressJS

# License

MIT

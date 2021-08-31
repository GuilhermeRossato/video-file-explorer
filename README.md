# Video Explorer

A ReactJS app to browse the host file system that shows metadata about video such as duration and size.

![Demonstration](demonstration.png)

# How to run

You must have [NodeJS](https://nodejs.org/), npm and [ffmpeg](https://www.ffmpeg.org/) installed

```
git clone ...
cd video-explorer-app
npm run start
```

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

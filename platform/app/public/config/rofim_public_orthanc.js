window.config = {
  routerBasename: '/',
  extensions: [],
  modes: [],
  showStudyList: false,
  showWarningMessageForCrossOrigin: false,
  showCPUFallbackMessage: true,
  strictZSpacingForVolumeViewport: true,
  useSharedArrayBuffer: 'AUTO',
  investigationalUseDialog: 'never',
  disableConfirmationPrompts: true,
  showPatientInfo: 'visible',
  omitQuotationForMultipartRequest: true,
  groupEnabledModesFirst: true,
  autoPlayCine: true,
  whiteLabeling: {
    createLogoComponentFn: function (React) {
      return React.createElement(
        'a',
        {
          target: '_self',
          rel: 'noopener noreferrer',
          className: 'text-purple-600 line-through',
          href: '/',
        },
        React.createElement('img', {
          src: 'https://rofim.doctor/assets/images/rofim/logo.png',
          width: 0,
          height: 0,
        })
      );
    },
  },
  studyPrefetcher: {
    /* Enable/disable study prefetching service (default: false) */
    enabled: true,
    /* Number of displaysets to be prefetched (default: 2)*/
    displaySetCount: 2,
    /**
     * Max number of concurrent prefetch requests (default: 10)
     * High numbers may impact on the time to load a new dropped series because
     * the browser will be busy with all prefetching requests. As soon as the
     * prefetch requests get fulfilled the new ones from the new dropped series
     * are sent to the server.
     *
     * TODO: abort all prefetch requests when a new series is loaded on a viewport.
     * (need to add support for `AbortController` on Cornerstone)
     * */
    maxNumPrefetchRequests: 10,
    /* Display sets loading order (closest (deafult), downward or upward) */
    order: 'closest',
  },
  defaultDataSourceName: 'dicomwebOrthanc',
  dataSources: [
    {
      namespace: '@ohif/extension-default.dataSourcesModule.dicomweb',
      sourceName: 'dicomwebOrthanc',
      configuration: {
        friendlyName: 'local Orthanc DICOMWeb Server',
        name: 'Orthanc',
        wadoUriRoot: `${window.ORTHANC_URL}/wado`,
        qidoRoot: `${window.ORTHANC_URL}/dicom-web`,
        wadoRoot: `${window.ORTHANC_URL}/dicom-web`,
        supportsWildcard: false,
        singlepart: 'bulkdata,video,pdf,image,thumbnail',
        qidoSupportsIncludeField: true,
        supportsReject: true,
        imageRendering: 'wadouri',
        thumbnailRendering: 'wadouri',
        enableStudyLazyLoad: true,
        supportsFuzzyMatching: true,
        dicomUploadEnabled: false,
        bulkDataURI: {
          enabled: true,
        },
      },
    },
  ],
};

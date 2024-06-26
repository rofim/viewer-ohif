window.config = {
    routerBasename: '/',
    extensions: [],
    modes: [],
    customizationService: {
        dicomUploadComponent:
            '@ohif/extension-cornerstone.customizationModule.cornerstoneDicomUploadComponent',
    },
    showStudyList: false,
    maxWebWorkers: 4,
    showLoadingIndicator: true,
    showWarningMessageForCrossOrigin: false,
    showCPUFallbackMessage: true,
    strictZSpacingForVolumeViewport: true,
    useSharedArrayBuffer: 'AUTO',
    // filterQueryParam: false,
    autoPlayCine: true,
    whiteLabeling: {
        createLogoComponentFn: function(React) {
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
                qidoSupportsIncludeField: true,
                supportsReject: true,
                imageRendering: 'wadouri',
                thumbnailRendering: 'wadouri',
                enableStudyLazyLoad: true,
                supportsFuzzyMatching: true,
                supportsWildcard: true,
                dicomUploadEnabled: false,
                bulkDataURI: {
                    enabled: true,
                },
            },
        },
    ],
};

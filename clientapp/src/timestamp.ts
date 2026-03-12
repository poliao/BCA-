import { ReplaceInFileConfig, replaceInFileSync, } from 'replace-in-file';
const timeStamp = new Date().toISOString();

const options: ReplaceInFileConfig = {
    files: [
        'src/version.ts',
    ],
    from: /timeStamp: '(.*)'/g,
    to: "timeStamp: '" + timeStamp + "'",
    allowEmptyPaths: false,
};

try {
    const changedFiles = replaceInFileSync(options);
    if (changedFiles.length == 0) {
        throw new Error(`Please make sure that the file ${options.files} has "timeStamp: ''`);
    }
    console.log('Build timestamp is set to: ' + timeStamp);
} catch (error) {
    console.error('Error occurred:', error);
    throw error
}
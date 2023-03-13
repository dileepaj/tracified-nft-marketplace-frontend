pipeline {
  agent any
  tools { nodejs 'nodejs-16' }

  stages {
    stage('Build') {
      steps {
        sh 'node --version'
        sh 'npm --version'
        sh 'npm install'
        script {
          if (env.BRANCH_NAME == "main") {
            sh 'npm run build-prod'
          } else if(env.BRANCH_NAME == "qa") {
            sh 'npm run build-qa'
          } else if (env.BRANCH_NAME == "staging") {
            sh 'npm run build-staging'
          } else {
            sh 'npm run build'
          }
        }
      }
    }
    stage('Test') {
      steps {
        sh 'echo test-step'
      }
    }
    stage('Analysis') {
      steps {
        sh 'echo analysis-step'
      }
    }
    stage('Environment Setup') {
      steps {
        script {
          if (env.BRANCH_NAME == "main") {
            env.BUCKET_NAME = 'marketplace.nft.tracified.com'
          } else if(env.BRANCH_NAME == "qa") {
            env.BUCKET_NAME = 'qa.marketplace.nft.tracified.com'
          } else if (env.BRANCH_NAME == "staging") {
            env.BUCKET_NAME = 'staging.marketplace.nft.tracified.com'
          }
        }
      }
    }

    stage('Deploy') {
      when {
        anyOf {
          branch 'staging'
          branch 'qa'
          branch 'main'
        }
      }
      steps {
        s3Upload(
          consoleLogLevel: 'INFO',
          dontWaitForConcurrentBuildCompletion: false,
          entries: [[
            bucket: env.BUCKET_NAME,
            excludedFile: '',
            flatten: false,
            gzipFiles: false,
            keepForever: false,
            managedArtifacts: false,
            noUploadOnFailure: true,
            selectedRegion: 'ap-south-1',
            showDirectlyInBrowser: false,
            sourceFile: 'dist/**',
            storageClass: 'STANDARD',
            uploadFromSlave: false,
            useServerSideEncryption: false
          ]],
          pluginFailureResultConstraint: 'FAILURE',
          profileName: 'tracified-admin-frontend-jenkins-deployer',
          userMetadata: [],
          dontSetBuildResultOnFailure: false
        )
      }
    }
  }
  post {
    always {
      echo 'Process finished'
      deleteDir()
    }
  }
}

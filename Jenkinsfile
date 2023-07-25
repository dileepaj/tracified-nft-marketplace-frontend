def scriptModule
pipeline {
  agent any
  tools { nodejs 'nodejs-16' }

  stages {
    stage('Build') {
      steps {
        sh 'node --version'
        sh 'npm --version'
        sh 'npm install'
        sh 'npm run build'
        script {
          scriptModule = load 'scripts/Upload.Groovy'
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

    stage('Deploy to QA') {
      when {
        branch 'main'
      }
      steps {
        sh 'npm run build-qa'
        script {
          scriptModule.uploadToS3('qa.marketplace.nft.tracified.com')
        }
      }
    }

    stage('Deploy to Staging') {
      when {
        branch 'main'
      }
      steps {
        sh 'npm run build-staging'
        script {
          scriptModule.uploadToS3('qa.marketplace.nft.tracified.com')
        }
      }
    }

  }
  post {
    always {
      echo 'Process finished'
      discordSend(
        description: "Tracified NFT Marketplace Frontend - ${currentBuild.currentResult}",
        footer: "#${env.BUILD_ID} ${currentBuild.getBuildCauses()[0].shortDescription}",
        link: env.BUILD_URL,
        result: currentBuild.currentResult,
        title: JOB_NAME,
        webhookURL: env.DISCORD_BUILD
      )
      deleteDir()
    }
  }
}
